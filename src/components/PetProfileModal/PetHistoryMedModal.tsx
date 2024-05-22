import { useState, useEffect } from "react";
import {
  ClinicalRecord,
  Treatment,
  AdmissionRecord,
  PetHistory,
} from "../../interfaces/PetHistory";
import Accordion from "react-bootstrap/Accordion";

interface PetHistoryMedModalProps {
  idMascota: string;
}

const fetchClinicalRecord = async (idMascota: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/ficha-clinica/mascota/${idMascota}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos de la ficha clínica recibidos:", data); // Log para verificar datos
    return data;
  } catch (error: any) {
    console.error("Error al cargar el registro clínico:", error.message);
    throw error;
  }
};

const fetchRecentPrescriptions = async (idFichaClinica: string) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/recetas-mascota/ficha-ingreso/${idFichaClinica}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al cargar las recetas recientes:", error.message);
    throw error;
  }
};

const fetchRecentTreatments = async (idFichaClinica: string) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/tratamientos-mascotas/ficha-clinica/${idFichaClinica}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al cargar los tratamientos recientes:", error.message);
    throw error;
  }
};

const fetchAdmissionRecords = async (idFichaClinica: string) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/ficha-ingreso/Ficha-clinica/${idFichaClinica}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error al cargar los registros de admisión:", error.message);
    throw error;
  }
};

const PetHistoryMedModal: React.FC<PetHistoryMedModalProps> = ({
  idMascota,
}) => {
  const [clinicalRecord, setClinicalRecord] = useState<ClinicalRecord | null>(
    null
  );
  const [recentPrescriptions, setRecentPrescriptions] = useState<PetHistory[]>(
    []
  );
  const [recentTreatments, setRecentTreatments] = useState<Treatment[]>([]);
  const [admissionRecords, setAdmissionRecords] = useState<AdmissionRecord[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinicalRecordData = await fetchClinicalRecord(idMascota);
        const idFichaClinica = clinicalRecordData.data?.idFichaClinica;

        if (idFichaClinica) {
          const recentPrescriptionsData = await fetchRecentPrescriptions(
            idFichaClinica
          );
          const recentTreatmentsData = await fetchRecentTreatments(
            idFichaClinica
          );
          const admissionRecordsData = await fetchAdmissionRecords(
            idFichaClinica
          );

          setRecentPrescriptions(recentPrescriptionsData.data);
          setRecentTreatments(recentTreatmentsData.data);
          setAdmissionRecords(admissionRecordsData.data);
        } else {
          console.error("No se encontró idFichaClinica en los datos clínicos");
        }

        setClinicalRecord(clinicalRecordData.data);
        setError(null);
      } catch (error: any) {
        console.error("Error al cargar los datos:", error.message);
        setError(`Error al cargar los datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idMascota]);

  return (
    <div>
      {isLoading ? (
        <p className="text-center">Cargando datos...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ficha Clínica Principal</Accordion.Header>
            <Accordion.Body>
              {clinicalRecord && (
                <div>
                  <p>
                    <strong>Fecha de Ingreso:</strong>{" "}
                    {clinicalRecord.fechaIngreso}
                  </p>
                  <p>
                    <strong>Enfermedades:</strong> {clinicalRecord.enfermedades}
                  </p>
                  <p>
                    <strong>Peso:</strong> {clinicalRecord.peso} kg
                  </p>
                  <p>
                    <strong>Observaciones:</strong>{" "}
                    {clinicalRecord.observaciones}
                  </p>
                  <p>
                    <strong>Antecedentes:</strong> {clinicalRecord.antecedentes}
                  </p>
                  <p>
                    <strong>ID Ficha Clínica:</strong>{" "}
                    {clinicalRecord.idFichaClinica}
                  </p>
                </div>
              )}
              <h5>Ficha de Ingreso</h5>
              {admissionRecords.map((record, index) => (
                <div key={index}>
                  <p>
                    <strong>Síntomas:</strong> {record.sintomas}
                  </p>
                  <p>
                    <strong>Antecedentes:</strong> {record.antecedentes}
                  </p>
                  <p>
                    <strong>Diagnóstico:</strong> {record.diagnostico}
                  </p>
                  <p>
                    <strong>Fecha de Ingreso:</strong> {record.fechaIngreso}
                  </p>
                  <p>
                    <strong>Fecha de Alta:</strong> {record.fechaAlta}
                  </p>
                  <p>
                    <strong>Observaciones:</strong> {record.observaciones}
                  </p>
                  <p>
                    <strong>Temperatura:</strong> {record.temperatura} °C
                  </p>
                  <hr />
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Recetas Recientes</Accordion.Header>
            <Accordion.Body>
              {recentPrescriptions.map((prescription, index) => (
                <div key={index}>
                  <p>
                    <strong>Medicamento:</strong> {prescription.description}
                  </p>
                  <p>
                    <strong>Veterinario:</strong> {prescription.vetName}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {prescription.date}
                  </p>
                  <hr />
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Tratamientos Recientes</Accordion.Header>
            <Accordion.Body>
              {recentTreatments.map((treatment, index) => (
                <div key={index}>
                  <p>
                    <strong>Descripción:</strong> {treatment.descripcion}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {treatment.fecha}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {treatment.tipo}
                  </p>
                  <p>
                    <strong>Costo:</strong> ${treatment.costo}
                  </p>
                  <hr />
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </div>
  );
};

export default PetHistoryMedModal;
