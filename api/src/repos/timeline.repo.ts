import { Timeline } from "@prisma/client";
import { connectDb } from "../services/db";

export class TimelineRepo {
  private static db = connectDb();
  private static timelines = this.db.timeline;

  static async create(
    timeline: Partial<Timeline>,
    dbTimelines?: typeof this.timelines
  ): Promise<Timeline> {
    try {
      return (dbTimelines ?? this.timelines).create({
        data: timeline as Timeline,
      });
    } catch (error: any) {
      throw error;
    }
  }

  static async createMany(
    timelines: Partial<Timeline>[],
    dbTimelines?: typeof this.timelines
  ): Promise<Timeline[]> {
    try {
      return (dbTimelines ?? this.timelines).createMany({
        data: timelines as Timeline[],
      }) as any;
    } catch (error: any) {
      throw error;
    }
  }
}
