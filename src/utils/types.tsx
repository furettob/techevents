export type EventType = {
  id: number,
  name: string,
  startDate: string,
  endDate: string,
  isFree: boolean,
  city: number,
  cityName: string
};

export type EventFilterType = {
  myEvents?: boolean,
  onlyFreeEvents?: boolean,
  txtSearch?:string,
  timeRangeStart?:number,
  timeRangeEnd?:number,
}