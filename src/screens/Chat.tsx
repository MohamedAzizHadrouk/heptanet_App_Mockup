import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bubbleTime, fullName, initialsOf, separatorLabel, userInitials, useStore } from '../store';
import { Dialog, Icon, Sheet, useToast } from '../components/ui';
import type { Message } from '../data/types';

const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** chat_view.dart + widgets/chat/* */
export default function Chat() {
  const nav = useNavigate();
  const toast = useToast();
  const id = Number(useParams().id);
  const { me, users, conversations, messages, typing, sendMessage, sendVoice, editMessage, deleteMessage, markAllRead } = useStore();
  const conv = conversations.find((c) => c.id === id);
  const list = useMemo(() => messages.filter((m) => m.conversationId === id), [messages, id]);
  const [text, setText] = useState('');
  const [menu, setMenu] = useState<Message | null>(null);
  const [editing, setEditing] = useState<Message | null>(null);
  const [editText, setEditText] = useState('');
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [headMenu, setHeadMenu] = useState(false);
  const [rec, setRec] = useState<{ seconds: number } | null>(null);
  const recorder = useRef<{ mr: MediaRecorder; chunks: Blob[]; start: number; stream: MediaStream; keep: boolean } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<number | null>(null);

  useEffect(() => { markAllRead(id); }, [id, list.length, markAllRead]);
  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }); }, [list.length, typing[id]]);
  useEffect(() => {
    if (!rec) return;
    const t = setTimeout(() => setRec((r) => (r ? { seconds: r.seconds + 1 } : r)), 1000);
    return () => clearTimeout(t);
  }, [rec]);

  if (!conv) return <div className="screen"><div className="empty">Conversation introuvable<button className="btn-text" onClick={() => nav('/home')}>Retour</button></div></div>;

  const userById = (uid: number) => users.find((u) => u.id === uid);
  const other = userById(conv.participantIds.find((p) => p !== me!.id) ?? -1);
  const title = conv.type === 'group' ? conv.name ?? 'Groupe' : fullName(other);
  const typer = typing[id] ? userById(typing[id]!) : undefined;

  const send = () => { if (text.trim()) { sendMessage(id, text.trim()); setText(''); } };

  // ---- Message vocal : vrai enregistrement micro (comme le package `record` en Flutter)
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const r = { mr, chunks: [] as Blob[], start: Date.now(), stream, keep: true };
      mr.ondataavailable = (e) => e.data.size && r.chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (!r.keep) return;
        const secs = Math.max(1, Math.round((Date.now() - r.start) / 1000));
        sendVoice(id, URL.createObjectURL(new Blob(r.chunks, { type: mr.mimeType })), secs);
      };
      mr.start();
      recorder.current = r;
      setRec({ seconds: 0 });
    } catch {
      toast('Permission micro refusée', 'err');
    }
  };
  const stopRec = (keep: boolean) => {
    if (recorder.current) { recorder.current.keep = keep; recorder.current.mr.stop(); recorder.current = null; }
    setRec(null);
  };

  const longPressStart = (m: Message) => {
    if (m.senderId !== me!.id) return;
    pressTimer.current = window.setTimeout(() => setMenu(m), 500);
  };
  const longPressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  return (
    <div className="screen">
      <header className="appbar lead">
        <button className="icon-btn" onClick={() => nav('/home?s=messages')}><Icon name="arrow_back" /></button>
        <div style={{ flex: 1, marginLeft: 8, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          {typer && <div style={{ fontSize: 12, color: 'var(--grey-600)', fontStyle: 'italic' }}>typing...</div>}
        </div>
        <button className="icon-btn" onClick={() => setHeadMenu(true)}><Icon name="more_vert" /></button>
      </header>

      <div className="chat-body" ref={bodyRef}>
        <div className="spacer" />
        {list.length === 0 && (
          <div className="empty" style={{ minHeight: 0 }}>
            <Icon name="chat_bubble" className="xl" style={{ color: 'var(--grey-300)' }} />
            <div style={{ fontSize: 16 }}>No messages yet</div>
            <div style={{ fontSize: 14, color: 'var(--grey-500)' }}>Start the conversation!</div>
          </div>
        )}
        {list.map((m, i) => {
          const mine = m.senderId === me!.id;
          const sender = userById(m.senderId);
          const newDay = i > 0 && new Date(list[i - 1].sentAt).toDateString() !== new Date(m.sentAt).toDateString();
          return (
            <Fragment key={m.id}>
              {newDay && <div className="sep">{separatorLabel(m.sentAt)}</div>}
              <div className={`mrow ${mine ? 'mine' : 'theirs'}`}>
                {!mine && <div className="av s36">{initialsOf(fullName(sender))}</div>}
                <div className="bubble" onContextMenu={(e) => { if (mine) { e.preventDefault(); setMenu(m); } }}
                  onPointerDown={() => longPressStart(m)} onPointerUp={longPressEnd} onPointerLeave={longPressEnd}>
                  {!mine && <div className="sender">{fullName(sender)}</div>}
                  {m.type === 'voice' ? <VoiceBubble seconds={m.durationSec ?? 0} url={m.audioUrl} /> : <div className="text">{m.content}</div>}
                  <div className="foot">
                    <span>{bubbleTime(m.sentAt)}{m.editedAt ? ' (edited)' : ''}</span>
                    {mine && <StatusIcon status={m.status} />}
                  </div>
                </div>
                {mine && <div className="av dark s36">{userInitials(me!)}</div>}
              </div>
            </Fragment>
          );
        })}
        {typer && <div className="typing-pill">{fullName(typer)} is typing <span className="dots"><i /><i /><i /></span></div>}
      </div>

      <div className="composer">
        {!rec ? (
          <>
            <button className="round" title="Message vocal" onClick={startRec}><Icon name="mic" /></button>
            <div className="box">
              <textarea rows={1} placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
            </div>
            <button className="round send" disabled={!text.trim()} onClick={send}><Icon name="send" /></button>
          </>
        ) : (
          <>
            <button className="icon-btn" title="Annuler" onClick={() => stopRec(false)}><Icon name="delete" /></button>
            <div className="rec-bar"><Icon name="fiber_manual_record" className="sm" fill />Enregistrement… {fmtDur(rec.seconds)}</div>
            <button className="round rec" title="Envoyer" onClick={() => stopRec(true)}><Icon name="send" /></button>
          </>
        )}
      </div>

      {menu && (
        <Sheet onClose={() => setMenu(null)}>
          {menu.type === 'text' && <button className="menu-item" onClick={() => { setEditing(menu); setEditText(menu.content); setMenu(null); }}><Icon name="edit" />Edit</button>}
          <button className="menu-item red" onClick={() => { setToDelete(menu); setMenu(null); }}><Icon name="delete" />Delete</button>
          <button className="menu-item" onClick={() => setMenu(null)}><Icon name="close" />Cancel</button>
        </Sheet>
      )}
      {headMenu && (
        <Sheet onClose={() => setHeadMenu(false)}>
          <button className="menu-item" onClick={() => { markAllRead(id); setHeadMenu(false); }}><Icon name="done_all" />Mark all as read</button>
          <button className="menu-item" onClick={() => setHeadMenu(false)}><Icon name="refresh" />Refresh</button>
          <button className="menu-item" onClick={() => setHeadMenu(false)}><Icon name="close" />Cancel</button>
        </Sheet>
      )}
      {editing && (
        <Dialog onClose={() => setEditing(null)}>
          <h3>Edit Message</h3>
          <textarea className="textarea" placeholder="Enter new message" value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
          <div className="actions">
            <button className="btn-text" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-black" onClick={() => { if (editText.trim()) editMessage(editing.id, editText.trim()); setEditing(null); }}>Save</button>
          </div>
        </Dialog>
      )}
      {toDelete && (
        <Dialog onClose={() => setToDelete(null)}>
          <h3>Delete Message</h3>
          <p>Are you sure you want to delete this message?</p>
          <div className="actions">
            <button className="btn-text" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn-black" style={{ background: 'var(--red)' }} onClick={() => { deleteMessage(toDelete.id); setToDelete(null); }}>Delete</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Message['status'] }) {
  if (status === 'sending') return <Icon name="schedule" className="xs" />;
  if (status === 'sent') return <Icon name="check" className="xs" />;
  if (status === 'delivered') return <Icon name="done_all" className="xs" />;
  if (status === 'read') return <Icon name="done_all" className="xs tick-read" />;
  return <Icon name="error" className="xs" />;
}

const BARS = Array.from({ length: 26 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));

/** voice_message_bubble.dart – lit le vrai enregistrement s'il existe. */
function VoiceBubble({ seconds, url }: { seconds: number; url?: string }) {
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const a = new Audio(url);
    a.ontimeupdate = () => setPos(a.currentTime);
    a.onended = () => { setPlaying(false); setPos(0); };
    audio.current = a;
    return () => { a.pause(); };
  }, [url]);
  useEffect(() => {
    if (url || !playing) return;
    if (pos >= seconds) { setPlaying(false); setPos(0); return; }
    const t = setTimeout(() => setPos((p) => p + 0.25), 250);
    return () => clearTimeout(t);
  }, [url, playing, pos, seconds]);

  const toggle = () => {
    if (audio.current) { if (playing) audio.current.pause(); else void audio.current.play(); }
    setPlaying(!playing);
  };
  const ratio = seconds ? pos / seconds : 0;
  return (
    <div className="voice">
      <button className="play" onClick={toggle}><Icon name={playing ? 'pause' : 'play_arrow'} fill /></button>
      <div className="wave">{BARS.map((h, i) => <i key={i} className={i / BARS.length < ratio ? 'on' : ''} style={{ height: `${h * 100}%` }} />)}</div>
      <span className="dur">{fmtDur(playing || pos ? pos : seconds)}</span>
    </div>
  );
}
