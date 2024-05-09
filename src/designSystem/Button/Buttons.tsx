import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonTypes =
  | "create"
  | "edit"
  | "delete"
  | "cancel"
  | "detail"
  | "save"
  | "others";
type ButtonSizes = "sm" | "md" | "lg" | "xl";

type ButtonProps = {
  type?: ButtonTypes;
  size?: ButtonSizes;
  href?: string;
  className?: string;
  customStyles?: string;
  wrapperClassName?: string;
  onClick?: (...args: any[]) => void;
  children: ReactNode;
  disabled?: boolean;
  isAnimated?: boolean;
  origin?: "top" | "right" | "bottom" | "left";
  [key: string]: any;
};

export const Button = ({
  type = "create",
  size = "md",
  href = "",
  className = "",
  customStyles = "",
  wrapperClassName = "",
  onClick = undefined,
  children,
  disabled = false,
  isAnimated = false,
  origin = "bottom",
  id = "",
  ...rest
}: ButtonProps) => {
  if (href) {
    return (
      <Link
        href={href}
        className={`${className} ${customStyles}`}
        onClick={onClick}
      >
        <ButtonBody
          type={type}
          disabled={disabled}
          size={size}
          customStyles={customStyles}
        >
          {children}
        </ButtonBody>
      </Link>
    );
  }

  return (
    <button
      className={`transition-all relative group overflow-visible ${className}`}
      onClick={onClick}
      type={rest?.isSubmit ? "submit" : "button"}
    >
      <ButtonBody
        id={id}
        type={type}
        size={size}
        customStyles={customStyles}
        disabled={disabled}
        {...rest}
      >
        {children}
      </ButtonBody>
    </button>
  );
};

const ButtonBody = ({
  type,
  size,
  customStyles,
  disabled = false,
  children,
  id,
  ...rest
}: {
  type: ButtonTypes;
  size: ButtonSizes;
  customStyles?: string;
  disabled?: boolean;
  children: ReactNode;
  id?: string;
}) => {
  const DISABLED_STYLES =
    "cursor-default pointer-events-none border-none bg-white text-hg-black300 hover:bg-hg-black100 hover:text-hg-black300 active:bg-hg-black100 active:text-hg-black300";

  const STYLES: any = {
    create:
      "bg-okron-btCreate text-white px-4 py-2 rounded-md hover:bg-okron-btCreateHover focus:outline-none focus:ring focus:border-blue-300",
    edit: "bg-okron-btEdit text-white px-4 py-2 rounded-md hover:bg-okron-btEditHover focus:outline-none focus:ring focus:border-blue-300",
    delete:
      "bg-okron-btDelete text-white px-4 py-2 rounded-md hover:bg-okron-btDeleteHover focus:outline-none focus:ring focus:border-blue-300",
    cancel:
      "bg-okron-btnCancel text-white px-4 py-2 rounded-md hover:bg-okron-btnCancelHover focus:outline-none focus:ring focus:border-blue-300",
    others:
      "bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 items-center gap-2",
    sm: "items-center text-xs font-medium h-[32px] px-4",
    md: "items-center font-medium h-[40px] px-4",
    lg: "items-center text-md font-semibold h-[48px] px-6",
    xl: "items-center h-[60px] text-md font-semibold px-6",
  };
  const styles = twMerge(
    `${STYLES.common} ${STYLES[type]} ${STYLES[size]} ${customStyles} ${
      disabled ? DISABLED_STYLES : ""
    }`
  );
  return <div className={`${styles} ${customStyles}`}>{children}</div>;
};
