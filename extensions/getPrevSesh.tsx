import { Paths, File } from "expo-file-system";
import type { Session } from "@/components/types";

export const getPrevSesh = async (date: string, workoutId: number): Promise<Session | undefined> => {
	const file = new File(Paths.document, 'data', 'sessions.json');
	if (!file.exists) return undefined;
	const text = await file.text();
	const sessions: Session[] = text.length > 0 ? JSON.parse(text) : [];
	const dateOnly = date.split('T')[0];

	return sessions
	.filter(s => s.workout.id === workoutId && s.date.split('T')[0] < dateOnly)
	.sort((a, b) => b.date.localeCompare(a.date))
	.at(0);
}
