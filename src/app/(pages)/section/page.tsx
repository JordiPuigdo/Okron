"use client";

import { useEffect, useState } from "react";
import Container from "components/layout/Container";
import MainLayout from "components/layout/MainLayout";
import SectionService from "app/services/sectionService";
import Section from "app/interfaces/Section";
import Link from "next/link";
import { SvgSpinner } from "app/icons/icons";

export default function AuthenticationPage() {
  const sectionService = new SectionService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sectionService
      .getSections()
      .then((sections) => {
        setSections(sections);
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSections = sections.slice(
    indexOfFirstSection,
    indexOfLastSection
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <MainLayout>
      <Container>
        <div className="flex">
          <Link
            href={{
              pathname: "/section/id",
            }}
            className="text-white mb-2 rounded-md bg-blue-500 px-4 py-2 flex"
            onClick={(e) => setIsLoading(true)}
          >
            Crear Secció
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Codi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripció
                </th>
                <th>Accions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSections.map((section) => (
                <tr key={section.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {section.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {section.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href="/section/[id]"
                      as={`/section/${section.id}`}
                      className="bg-green-500 text-white px-3 py-1 ml-2 rounded-md items-center"
                      onClick={(e) => setIsLoading(true)}
                    >
                      Editar
                      {isLoading && <SvgSpinner className="ml-2 w-4 h-4" />}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(sections.length / sectionsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 border border-gray-300 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
