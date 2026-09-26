import { cx } from '../../utils/accents'

// Pass titleAs="h1" when the empty state is the whole page (e.g. not found).
export function EmptyState({ icon: Icon, title, titleAs: Title = 'p', body, action, className }) {
  return (
    <div className={cx('flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-12 text-center', className)}>
      {Icon && <Icon aria-hidden="true" className="size-6 text-paper/45" />}
      <Title className="mt-3 text-lg font-semibold">{title}</Title>
      {body && <p className="mt-1 max-w-sm text-sm text-paper/60">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

