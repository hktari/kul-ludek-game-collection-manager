export default class BoardGameGeekErrorParser {
  private errors: Record<string, string>[] = [];

  add(errors: Record<string, string>) {
    this.errors.push(errors);
    return this;
  }

  _errorsToString(errors: Record<string, string[]>) {
    return Object.entries(errors)
      .map(([attr, err]) => `[${attr}]: ${err.join(', ')}`)
      .join("\n");
  }

  parse(): string {
    const combinedErrors: Record<string, string[]> = {};

    for (const errors of this.errors) {
      for (const [propertyName, errorMessage] of Object.entries(errors)) {
        const errorsArr = combinedErrors[propertyName] || [];
        errorsArr.push(errorMessage);
        combinedErrors[propertyName] = errorsArr;
      }
    }

    return this._errorsToString(combinedErrors);
  }
}
