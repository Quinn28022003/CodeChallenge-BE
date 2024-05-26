export class TimeFormatter {
	public convert(date: Date): string {
		const dataReal: string = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
		return dataReal
	}
}
