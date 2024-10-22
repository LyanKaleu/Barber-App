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
export async function getBarberMonthAvailability(
    barberId: string,
    year: number,
    month: number
): Promise<{ availableDays: { day: number; available: boolean }[] }> {
    const availability: { availableDays: { day: number; available: boolean }[] } = { availableDays: [] };

    const daysInMonth = new Date(year, month, 0).getDate(); // Total de dias no mês
    const today = new Date();

    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.schedulingCollectionId,
            [
                Query.equal("barberId", barberId),
                Query.greaterThanEqual("schedule", new Date(year, month - 1, 1).toISOString()), // Início do mês
                Query.lessThan("schedule", new Date(year, month, 1).toISOString()) // Próximo mês
            ]
        );

        // Organizar os horários agendados por dia
        const occupiedHoursByDay: { [day: number]: Set<number> } = {};
        response.documents.forEach(appointment => {
            const appointmentDate = new Date(appointment.schedule);

            const hour = appointmentDate.getUTCHours(); 

            const day = appointmentDate.getDate();

            if (!occupiedHoursByDay[day]) {
                occupiedHoursByDay[day] = new Set<number>();
            }
            occupiedHoursByDay[day].add(hour);
        });

        
        // Verificar disponibilidade para cada dia do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const selectedDate = new Date(year, month - 1, day);
  
            // Se o dia já passou, marca como indisponível
            if (selectedDate < today) {
                console.log(day);
                
                availability.availableDays.push({
                    day,
                    available: false
                });
                continue;
            }

            const occupiedHours = occupiedHoursByDay[day] || new Set<number>();

            // Se nem todos os horários estiverem ocupados, o dia está disponível
            const allHoursOccupied = occupiedHours.size >= 9; // Exemplo: dia tem 9 horários (9h-17h)
            availability.availableDays.push({
                day,
                available: !allHoursOccupied // O dia fica indisponível apenas se todos os horários estiverem ocupados
            });
        }

        return availability;
    } catch (error) {
        console.error("Error fetching barber month availability:", error);
        return { availableDays: [] };
    }
}



// Função para buscar a disponibilidade diária do barbeiro
export async function getBarberDayAvailability(
    barberId: string,
    year: number,
    month: number,
    day: number
): Promise<{ availableSlots: { hour: number; available: boolean }[] }> {
    const availability: { availableSlots: { hour: number; available: boolean }[] } = { availableSlots: [] };

    // Obter a data atual e ajustar para o horário local
    const today = new Date();
    const currentHour = today.getHours(); // Hora atual no fuso local
    const selectedDate = new Date(year, month - 1, day);

    // Bloquear automaticamente se o dia já passou
    if (selectedDate < today) {
        for (let hour = 8; hour <= 17; hour++) {
            availability.availableSlots.push({
                hour,
                available: false // Bloqueia o horário para dias passados
            });
        }
        return availability; // Retorna todos os horários como indisponíveis para dias passados
    }

    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.schedulingCollectionId,
            [
                Query.equal("barberId", barberId),
                Query.greaterThanEqual("schedule", new Date(year, month - 1, day, 0, 0, 0).toISOString()), // Início do dia
                Query.lessThan("schedule", new Date(year, month - 1, day + 1, 0, 0, 0).toISOString()) // Próximo dia
            ]
        );

        // Marcar horários ocupados
        const occupiedHours = new Set<number>();
        response.documents.forEach(appointment => {
            const appointmentDate = new Date(appointment.schedule);

            const hour = appointmentDate.getUTCHours(); // Extrai a hora correta do localTime

            occupiedHours.add(hour); // Adiciona a hora ao Set
        });

        // Verificar disponibilidade para cada horário do dia (exemplo das 9h às 17h)
        for (let hour = 8; hour <= 17; hour++) {
            if (selectedDate.getDate() === today.getDate() && hour <= currentHour) {
                availability.availableSlots.push({
                    hour,
                    available: false // Bloqueia horários passados no dia de hoje
                });
            } else {
                availability.availableSlots.push({
                    hour,
                    available: !occupiedHours.has(hour) // Marca como disponível se não estiver ocupado
                });
            }
        }

        return availability; // Retorna a disponibilidade dos horários
    } catch (error) {
        console.error("Error fetching barber day availability:", error);
        return { availableSlots: [] };
    }
}

