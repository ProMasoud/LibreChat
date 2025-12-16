import { useAtomValue } from 'jotai';
import { forwardRef, useLayoutEffect, useState, useMemo } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';
import { chatDirectionAtom } from '~/store';
import { detectTextDirection } from '~/utils';

type BaseTextareaAutosizeProps = Omit<TextareaAutosizeProps, 'aria-label' | 'aria-labelledby'>;

export type TextareaAutosizePropsWithAria =
  | (BaseTextareaAutosizeProps & {
      'aria-label': string;
      'aria-labelledby'?: never;
    })
  | (BaseTextareaAutosizeProps & {
      'aria-labelledby': string;
      'aria-label'?: never;
    });

export const TextareaAutosize = forwardRef<HTMLTextAreaElement, TextareaAutosizePropsWithAria>(
  (props, ref) => {
    const [, setIsRerendered] = useState(false);
    const globalDirection = useAtomValue(chatDirectionAtom).toLowerCase();
    useLayoutEffect(() => setIsRerendered(true), []);

    // Get text value from props (could be value or defaultValue)
    const textValue = (props.value ?? props.defaultValue ?? '') as string;

    // Detect text direction based on content - only when global direction is set to 'auto' or when text has RTL content
    const detectedDirection = useMemo(() => {
      // If global direction is explicitly set to rtl or ltr, use that as default but still allow auto-detection
      if (textValue && textValue.length > 0) {
        return detectTextDirection(textValue);
      }
      return globalDirection as 'rtl' | 'ltr';
    }, [textValue, globalDirection]);

    // Use detected direction for text input, falling back to global setting
    const effectiveDirection = textValue.length > 0 ? detectedDirection : globalDirection;

    return <ReactTextareaAutosize dir={effectiveDirection} {...props} ref={ref} />;
  },
);
