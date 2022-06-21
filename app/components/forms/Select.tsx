import classNames from "classnames";
import { useSelect } from "downshift";
import type { HTMLAttributes } from "react";

export type SelectItem = {
  title: string;
  value: string | number;
};

export interface SelectProps {
  items: SelectItem[];
  label?: string;
  placeholder?: string;
  labelProps?: HTMLAttributes<HTMLLabelElement>;
}

export function Select({
  items,
  labelProps: { className: labelPropsClassName, ...labelProps } = {},
  placeholder,
  label,
}: SelectProps) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    itemToString: (item) => (item?.title ? item.title : ""),
  });

  return (
    <div>
      <div className="w-72 flex flex-col gap-1">
        {label ? (
          <label {...getLabelProps()} {...labelProps}>
            {label}
          </label>
        ) : (
          <></>
        )}
        <button
          aria-label="toggle select menu"
          className="p-2 bg-white flex"
          type="button"
          {...getToggleButtonProps()}
        >
          <span>
            {selectedItem
              ? selectedItem.title
              : placeholder || "Select an option"}
          </span>
        </button>
      </div>
      <ul
        {...getMenuProps()}
        className={classNames(
          labelPropsClassName,
          `absolute w-72 bg-white max-h-80 overflow-y-scroll ${
            isOpen ? "block" : "hidden"
          }`
        )}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={classNames(
                highlightedIndex === index && "bg-green-200",
                selectedItem === item && "font-bold",
                "p-2 flex flex-row w-full cursor-pointer transition-colors"
              )}
              key={`${item.value}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.title}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
