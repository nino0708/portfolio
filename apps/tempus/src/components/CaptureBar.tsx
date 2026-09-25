import { useEffect, useRef, useState } from 'react';

/**
 * 全画面に固定される1行入力欄。打って Enter で終わり。
 * 画面遷移もモーダルも必須項目も挟まない — 起票が重いと使わなくなるため。
 */
export function CaptureBar({
  onSubmit,
  offlineCount,
}: {
  onSubmit: (title: string) => Promise<void>;
  offlineCount: number;
}) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  // ホーム画面のショートカット (?capture=1) から開いた時はカーソルを当てた状態にする
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('capture') === '1') {
      ref.current?.focus();
    }
  }, []);

  const submit = async () => {
    const title = value.trim();
    if (!title || busy) return;
    setBusy(true);
    setValue('');
    try {
      await onSubmit(title);
      setFlash(`登録した: ${title.slice(0, 20)}`);
    } catch {
      setFlash('登録できなかった');
    } finally {
      setBusy(false);
      ref.current?.focus();
      setTimeout(() => setFlash(null), 2200);
    }
  };

  return (
    <div className="capture">
      <div className="capture-inner">
        <input
          ref={ref}
          value={value}
          placeholder="思いついたことを書いて Enter"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }}
          enterKeyHint="done"
        />
        <button onClick={() => void submit()} disabled={busy || !value.trim()}>追加</button>
      </div>
      {(flash || offlineCount > 0) && (
        <div className="capture-hint">
          {flash}
          {offlineCount > 0 && ` ／ 未送信 ${offlineCount} 件（オンラインになったら自動で送る）`}
        </div>
      )}
    </div>
  );
}
