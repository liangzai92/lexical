import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import './index.css';

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props): JSX.Element {
  return (
    <div className='ContentEditable__wrapper'>
      <ContentEditable
        className={className ?? 'ContentEditable__root'}
        aria-placeholder={placeholder}
        placeholder={
          <p className={placeholderClassName ?? 'ContentEditable__placeholder'}>
            {placeholder}
          </p>
        }
      />
    </div>
  );
}
