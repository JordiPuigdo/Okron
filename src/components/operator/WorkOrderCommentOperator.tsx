import React, { useState } from "react";
import {
  AddCommentToWorkOrderRequest,
  WorkOrderComment,
} from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";
import { SvgSpinner } from "app/icons/icons";
import { useSessionStore } from "app/stores/globalStore";
import { formatDate } from "app/utils/utils";

interface IWorkOrderCommentOperator {
  workOrderComments: WorkOrderComment[];
  setWorkOrderComments: React.Dispatch<
    React.SetStateAction<WorkOrderComment[]>
  >;
  workOrderId: string;
  isFinished: boolean;
}

const WorkOrderOperatorComments: React.FC<IWorkOrderCommentOperator> = ({
  workOrderComments,
  setWorkOrderComments,
  workOrderId,
  isFinished,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const { operatorLogged } = useSessionStore((state) => state);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = workOrderComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddComment = async () => {
    try {
      setIsLoading(true);
      if (operatorLogged?.idOperatorLogged == undefined) {
        alert("Has de fitxar un operari per fer aquesta acció");
        return;
      }

      const commentToAdd: AddCommentToWorkOrderRequest = {
        comment: newComment,
        operatorId: operatorLogged.idOperatorLogged,
        workOrderId: workOrderId,
      };

      const wo = await workOrderService.addCommentToWorkOrder(commentToAdd);

      setWorkOrderComments((prevComments) => [...prevComments, wo]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setNewComment("");
    setIsLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      var x = await workOrderService.deleteCommentToWorkOrder(
        workOrderId,
        commentId
      );
      if (x) {
        setWorkOrderComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
        <span className="text-xl font-bold">Observacions</span>
      </div>

      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>

      <div className="bg-white shadow-md rounded my-6">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <input
              disabled={isFinished}
              type="text"
              placeholder="Afegir comentari aquí..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddComment}
              className={`ml-2 px-4 py-2  text-white rounded-md ${
                isFinished
                  ? "bg-gray-500"
                  : "bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
              }`}
              disabled={isFinished}
            >
              Afegir Comentari
              {isLoading && <SvgSpinner />}
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Comentaris de la ordre de treball
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Operari</th>
                  <th className="py-3 px-6 text-left">Comentari</th>
                  <th className="py-3 px-6 text-left">Data</th>
                  <th className="py-3 px-6 text-left">Accions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentComments
                  .slice(0)
                  .reverse()
                  .map((comment, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {comment.operator.name}
                      </td>
                      <td className="py-3 px-6 text-left">{comment.comment}</td>
                      <td className="py-3 px-6 text-left">
                        {formatDate(comment.creationDate)}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          onClick={() => handleDeleteComment(comment.id!)}
                          type="button"
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          itemsPerPage={commentsPerPage}
          totalItems={workOrderComments.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center my-4">
      <ul className="flex">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`${
              currentPage === number ? "border-teal-500 text-teal-500" : ""
            } hover:bg-teal-500 hover:text-white border border-gray-300 ${
              number === 1 ? "rounded-l" : ""
            } ${number === pageNumbers.length ? "rounded-r" : ""} px-3 py-2`}
          >
            <button type="button" onClick={() => paginate(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default WorkOrderOperatorComments;