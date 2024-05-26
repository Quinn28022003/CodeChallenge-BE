export class DateFormatter {
	public convert(date: Date): string {
		const init: Date = new Date(date)
		const dataReal: string = `${init.getDate()}/${init.getMonth() + 1}/${init.getFullYear()}`
		return dataReal
	}
}
