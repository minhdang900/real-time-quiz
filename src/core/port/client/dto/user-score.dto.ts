export class BookingOfficeHolidayQueryDto {
  bookingOfficeCode: string;
  countryCode: string;
  fromDate: Date;
  toDate: Date;
  constructor(init) {
    Object.assign(this, init);
  }
}
