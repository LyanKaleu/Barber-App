import { Query } from "react-native-appwrite";
import { CreateAppointmentParams } from "../../@types";
import { appwriteConfig, databases } from "../appwrite.config";

//  CREATE APPOINTMENT
export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
      const newAppointment = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.schedulingCollectionId,
        'unique()', // Gera um ID único para o documento
        appointment
      );
  
      return newAppointment; // Retorna o novo agendamento criado
    } catch (error) {
      console.error("An error occurred while creating a new appointment:", error);
      throw new Error("Falha ao criar agendamento"); // Lança um erro para que possa ser tratado onde a função é chamada
    }
  };

  // Função para buscar a disponibilidade mensal do barbeiro
export async function getBarberMonthAvailability(barberId: string, year: number, month: number): Promise<{ [key: string]: boolean }> {
    const availability: { [key: string]: boolean } = {};

    // Calcule o número de dias no mês
    const daysInMonth = new Date(year, month, 0).getDate();

    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.schedulingCollectionId, // A coleção de agendamentos
            [
                Query.equal("barberId", barberId),
                Query.greaterThanEqual("schedule", new Date(year, month - 1, 1).toISOString()), // Início do mês
                Query.lessThan("schedule", new Date(year, month, 1).toISOString()) // Início do próximo mês
            ]
        );

        // Marque os horários ocupados
        response.documents.forEach(appointment => {
            const appointmentDate = new Date(appointment.schedule);
            const day = appointmentDate.getDate();
            const hour = appointmentDate.getHours();
            const key = `${day}-${hour}`; // Formato "dia-hora"
            availability[key] = false; // Marca como ocupado
        });

        // Preencha a disponibilidade com todos os horários
        for (let day = 1; day <= daysInMonth; day++) {
            for (let hour = 0; hour < 24; hour++) {
                const key = `${day}-${hour}`;
                availability[key] = availability[key] || true; // Se não estiver ocupado, está disponível
            }
        }

        return availability; // Retorna um objeto com a disponibilidade
    } catch (error) {
        console.error("Error fetching barber month availability:", error);
        return {};
    }
}

// Função para buscar a disponibilidade diária do barbeiro
export async function getBarberDayAvailability(barberId: string, year: number, month: number, day: number): Promise<{ [key: string]: boolean }> {
    const availability: { [key: string]: boolean } = {};

    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.schedulingCollectionId, // A coleção de agendamentos
            [
                Query.equal("barberId", barberId),
                Query.equal("schedule", new Date(year, month - 1, day).toISOString())
            ]
        );

        // Marque os horários ocupados
        response.documents.forEach(appointment => {
            const appointmentDate = new Date(appointment.schedule);
            const hour = appointmentDate.getHours();
            availability[hour] = false; // Marca como ocupado
        });

        // Preencha a disponibilidade com todos os horários
        for (let hour = 0; hour < 24; hour++) {
            availability[hour] = availability[hour] || true; // Se não estiver ocupado, está disponível
        }

        return availability; // Retorna um objeto com a disponibilidade
    } catch (error) {
        console.error("Error fetching barber day availability:", error);
        return {};
    }
}
