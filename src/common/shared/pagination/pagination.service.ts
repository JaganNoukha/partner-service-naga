import { Injectable } from '@nestjs/common';
import * as momentTz from 'moment-timezone';
import { timeZone } from '../../constants/service-common.constants';

@Injectable()
export class PaginationService {
  async findAndPaginate(
    collection: any,
    collectionName: string,
    options: {
      filter?: Record<string, any>;
      skip?: number;
      limit?: number;
      projection?: Record<string, any>;
      sort?: Record<string, any>;
    } = {},
  ) {
    const {
      filter = {},
      skip = 0,
      limit = 10,
      projection = {},
      sort = { updatedAt: -1 },
    } = options;

    const validatedSkip = skip >= 0 ? skip : 0;
    const validatedLimit = limit > 0 ? limit : 10;

    const query = this.constructQuery(collectionName, filter);
    const [items, totalItems] = await Promise.all([
      collection.find(query, projection, {
        lean: true,
        sort,
        skip: validatedSkip,
        limit: validatedLimit,
      }),
      collection.countDocuments(query),
    ]);

    return {
      totalItems,
      totalPages: Math.max(Math.ceil(totalItems / validatedLimit), 1),
      skip: validatedSkip,
      limit: validatedLimit,
      items,
    };
  }

  private constructQuery(
    collectionName: string,
    filter: Record<string, any>,
  ): Record<string, any> {
    const query: Record<string, any> = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        this.applyLeadFilters(query, key, filter[key]);
      }
    }
    return query;
  }

  private applyLeadFilters(
    query: Record<string, any>,
    key: string,
    value: any,
  ): void {
    if (key === 'search' && typeof value === 'object') {
      const searchFields = value.fields;
      const searchValue = value.term;

      if (searchValue) {
        if (searchValue instanceof Array) {
          query.$or = searchFields.map((field) => ({
            [field]: { $in: searchValue.map((value) => new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) },
          }));
        } else {
          query.$or = searchFields.map((field) => ({
            [field]: new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
          }));
        }
      }
    } else if (Array.isArray(value)) {
      if (key.includes('$')) {
        query[key] = value;
      } else {
        const filteredValue = value.filter(item => item !== "N/A");
        if (value.includes("N/A")) {
          if (filteredValue.length > 0) {
            query.$or = [
              { [key]: { $in: filteredValue } },
              { [key]: { $exists: false } }
            ];
          } else {
            query[key] = { $exists: false };
          }
        } else {
          query[key] = { $in: value };
        }
      }
    } else if (typeof value === 'object') {
      if (value.from || value.to) {
        this.addDynamicDateFilter(query, key, value);
      } else {
        query[key] = value;
      }
    } else {
      if (value === 'NA') {
        query[key] = { $exists: false };
      } else {
        query[key] = value;
      }
    }
  }

  private addDynamicDateFilter(
    query: Record<string, any>,
    key: string,
    dateFilter: { from?: string; to?: string },
  ): void {
    const { from, to } = dateFilter;
    const fromDate = from ? momentTz.tz(new Date(from), timeZone).startOf('day') : null;
    const toDate = to ? momentTz.tz(new Date(to), timeZone).endOf('day') : fromDate;

    if (fromDate?.isValid() && toDate?.isValid()) {
      query[key] = {
        $gte: fromDate.toDate(),
        $lt: toDate.toDate(),
      };
      console.log(`${key} query range:`, query[key]);
    } else {
      console.log('No valid from or to dates provided for dynamic filtering');
    }
  }
}
