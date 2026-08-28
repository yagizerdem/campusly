type QueryString = Record<string, string | undefined>;

export class PrismaAPIFeatures {
  private queryString: QueryString;

  private where: Record<string, any> = {};
  private orderBy: Record<string, "asc" | "desc">[] = [];
  private select: Record<string, boolean> | undefined;
  private skip = 0;
  private take = 100;

  constructor(queryString: QueryString) {
    this.queryString = queryString;
  }

  filter() {
    const excludedFields = ["page", "sort", "limit", "fields"];

    for (const [key, value] of Object.entries(this.queryString)) {
      if (!value || excludedFields.includes(key)) {
        continue;
      }

      const match = key.match(/^(.+)\[(gte|gt|lte|lt|equals|contains)\]$/);

      if (match) {
        const [, field, operator] = match;

        if (field && operator) {
          this.where[field] = {
            ...(field && this.where[field] ? this.where[field] : {}),
            [operator]: this.parseValue(value),
          };
        }

        continue;
      }

      this.where[key] = this.parseValue(value);
    }

    return this;
  }

  sort() {
    const sort = this.queryString.sort;

    if (!sort) {
      this.orderBy = [{ createdAt: "desc" }];
      return this;
    }

    this.orderBy = sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return {
          [field.slice(1)]: "desc",
        };
      }

      return {
        [field]: "asc",
      };
    });

    return this;
  }

  selectFields() {
    const fields = this.queryString.fields;

    if (!fields) {
      return this;
    }

    this.select = Object.fromEntries(
      fields.split(",").map((field) => [field, true]),
    );

    return this;
  }

  paginate() {
    const page = Number.parseInt(this.queryString.page ?? "1", 10);
    const limit = Number.parseInt(this.queryString.limit ?? "100", 10);

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? 100 : limit;

    this.skip = (safePage - 1) * safeLimit;
    this.take = safeLimit;

    return this;
  }

  build() {
    return {
      where: this.where,
      orderBy: this.orderBy,
      ...(this.select ? { select: this.select } : {}),
      skip: this.skip,
      take: this.take,
    };
  }

  private parseValue(value: string) {
    if (value === "true") return true;
    if (value === "false") return false;

    const number = Number(value);

    if (!Number.isNaN(number) && value.trim() !== "") {
      return number;
    }

    return value;
  }
}
