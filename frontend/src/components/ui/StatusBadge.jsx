export function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-white border-yellow text-black',
    accepted: 'bg-black border-black text-white',
    rejected: 'bg-white border-black text-black',
    Active: 'bg-yellow border-black text-black',
    Closed: 'bg-white border-black text-black',
  };

  return (
    <span className={`inline-block px-3 py-1 border-2 ${styles[status] || styles.pending} text-xs uppercase tracking-widest font-bold`}>
      {status}
    </span>
  );
}
