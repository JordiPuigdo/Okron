import React, { useEffect, useState } from "react";
import AutocompleteSearchBar from "components/selector/AutocompleteSearchBar";
import { ElementList } from "components/selector/ElementList";

interface ChooseElementProps<T> {
  elements: T[];
  selectedElements: string[];
  onElementSelected: (id: string) => void;
  onDeleteElementSelected: (id: string) => void;
  placeholder: string;
  mapElement: (element: T) => { id: string; description: string };
}

const ChooseElement = <T,>({
  elements,
  selectedElements,
  onElementSelected,
  onDeleteElementSelected,
  placeholder,
  mapElement,
}: ChooseElementProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<ElementList[]>([]);
  const [filteredElements, setFilteredElements] = useState<ElementList[]>([]);

  useEffect(() => {
    const selectedItems = elements
      .filter((element) => selectedElements.includes(mapElement(element).id))
      .map(mapElement);
    setSelectedItems(selectedItems);

    const filteredElements = elements
      .filter(
        (element) =>
          !selectedElements.includes(mapElement(element).id) &&
          mapElement(element).description.toLowerCase()
      )
      .map(mapElement);
    setFilteredElements(filteredElements);
  }, [elements, selectedElements]);

  const handleElementSelected = (id: string) => {
    const selectedItem = elements.find(
      (element) => mapElement(element).id === id
    );
    if (selectedItem) {
      setSelectedItems((prevSelected) => [
        ...prevSelected,
        mapElement(selectedItem),
      ]);
      onElementSelected(id);
    }
  };

  const handleDeleteElementSelected = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item.id !== id)
    );
    onDeleteElementSelected(id);
  };

  return (
    <div className="flex flex-row gap-8 w-full my-6">
      <div className="w-full">
        <AutocompleteSearchBar
          elements={filteredElements}
          setCurrentId={handleElementSelected}
          placeholder={placeholder}
        />
        <div className="mt-4">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-gray-600 font-medium">
                {item.description}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteElementSelected(item.id)}
                className="bg-red-600 hover:bg-red-900 text-white rounded-xl py-2 px-4 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseElement;
