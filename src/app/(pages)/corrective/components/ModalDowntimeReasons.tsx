import { SvgClose } from 'app/icons/icons';
import { useGlobalStore } from 'app/stores/globalStore';
import { Modal } from 'designSystem/Modals/Modal';

import DowntimesService from 'app/services/downtimesService';
import { useEffect, useState } from 'react';
import {
  DowntimesReasons,
  DowntimesReasonsType,
} from 'app/interfaces/Production/Downtimes';

interface ModalDowntimeReasonsProps {
  selectedId: string;
  onSelectedDowntimeReasons: (downtimeReasons: DowntimesReasons) => void;
}

const ModalDowntimeReasons: React.FC<ModalDowntimeReasonsProps> = ({
  selectedId,
  onSelectedDowntimeReasons,
}) => {
  const { setIsModalOpen } = useGlobalStore(state => state);

  const selectedDowntime = (downtimeReasons: DowntimesReasons) => {
    setIsModalOpen(false);
    onSelectedDowntimeReasons(downtimeReasons);
  };

  return (
    <Modal
      isVisible={true}
      type="center"
      height="h-auto"
      width="w-full"
      className="max-w-sm mx-auto border border-black"
      avoidClosing={true}
    >
      <div>
        <div className="relative bg-white">
          <div className="absolute p-2 top-0 right-0 justify-end hover:cursor-pointer">
            <SvgClose
              onClick={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
        <DowntimeReasonsModal
          selectedId={selectedId}
          onSelectedDowntimeReasons={selectedDowntime}
        />
      </div>
      <div></div>
    </Modal>
  );
};

export default ModalDowntimeReasons;

interface DowntimeReasonsModalProps {
  selectedId: string;
  onSelectedDowntimeReasons: (downtimeReasons: DowntimesReasons) => void;
}

const DowntimeReasonsModal: React.FC<DowntimeReasonsModalProps> = ({
  selectedId,
  onSelectedDowntimeReasons,
}) => {
  const downtimeService = new DowntimesService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [downtimeReasons, setDowntimeReasons] = useState<DowntimesReasons[]>(
    []
  );
  const [filteredDowntimeReasons, setFilteredDowntimeReasons] = useState<
    DowntimesReasons[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<
    DowntimesReasonsType | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  useEffect(() => {
    downtimeService
      .getDowntimesReasonsByMachineId(selectedId, true)
      .then(response => {
        setDowntimeReasons(response);
        setFilteredDowntimeReasons(response);
      });
  }, []);

  function handleFilterTypeChange(value: number) {
    if (value === selectedFilter) {
      setFilteredDowntimeReasons(downtimeReasons);
      setSelectedFilter(undefined);
      return;
    }
    setSelectedFilter(value);
    setFilteredDowntimeReasons(
      downtimeReasons.filter(reason => reason.downTimeType === value)
    );
    setCurrentPage(0);
  }
  const paginatedDowntimeReasons = filteredDowntimeReasons.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(filteredDowntimeReasons.length / itemsPerPage);

  return (
    <div className="p-8 mx-8">
      <div className="flex flex-row justify-between items-center">
        <div
          className={`p-4 w-full bg-blue-100 hover:cursor-pointer mx-2 rounded-sm className
          text-center      ${
            selectedFilter == DowntimesReasonsType.Production && 'bg-blue-300'
          }`}
          onClick={() =>
            handleFilterTypeChange(DowntimesReasonsType.Production)
          }
        >
          Producció
        </div>
        <div
          className={`p-4 w-full bg-blue-100 text-center hover:cursor-pointer mx-2
            ${
              selectedFilter == DowntimesReasonsType.Maintanance &&
              'bg-blue-300'
            }`}
          onClick={() =>
            handleFilterTypeChange(DowntimesReasonsType.Maintanance)
          }
        >
          Manteniment
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {paginatedDowntimeReasons.map((reason, index) => (
          <div key={reason.id} className="p-2">
            <div
              className="p-4 border bg-gray-200 hover:cursor-pointer shadow-sm rounded-sm border-black"
              onClick={() => onSelectedDowntimeReasons(reason)}
            >
              {reason.description} - {reason.downTimeType}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className={`px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50`}
        >
          Anterior
        </button>
        <button
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Següent
        </button>
      </div>
    </div>
  );
};
