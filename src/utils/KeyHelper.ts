export class KeyHelper {
  expireDate: Date;

  constructor(expireDate: Date) {
    this.expireDate = expireDate;
  }

  isExpired(): boolean {
    const now = new Date();
    return now >= this.expireDate;
  }

  getTimeLeft(): { days: number; hours: number; minutes: number } {
    const now = new Date();
    const timeDiff = this.expireDate.getTime() - now.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }
}
