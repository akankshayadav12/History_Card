import Modal from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.'
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted dark:text-mutedDark mt-2">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="
            px-4 py-2 rounded-xl
            bg-muted/10 text-muted dark:bg-mutedDark/20 dark:text-mutedDark
            hover:bg-muted/20 dark:hover:bg-mutedDark/30
            transition-all duration-300 ease-in-out
          "
        >
          Cancel
        </button>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="
            px-4 py-2 rounded-xl
            bg-primary text-primary.foreground
            hover:bg-primary.light
            transition-all duration-300 ease-in-out
          "
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
