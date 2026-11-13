import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type BaseProps = {
  className?: string;
};

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsAnchor | ButtonAsButton;

export default function Button(props: ButtonProps) {
  const baseClassName =
    "inline-block bg-kfc px-4 py-1.5 font-rokkitt text-sm font-extrabold uppercase tracking-wide text-white transition hover:brightness-90";
  const combinedClassName = props.className
    ? `${baseClassName} ${props.className}`
    : baseClassName;

  if ("href" in props && props.href !== undefined) {
    const { className: _, ...anchorProps } = props;
    return <a {...anchorProps} className={combinedClassName} />;
  }

  const { className: _, ...buttonProps } = props as ButtonAsButton;
  return <button type="button" {...buttonProps} className={combinedClassName} />;
}
