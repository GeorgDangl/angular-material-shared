export class GuidGenerator {
  /**
  * Taken from https://github.com/Steve-Fenton/TypeScriptUtilities/blob/master/Guid
  * (modified)
  * Generates a Version 4 (= Pseudorandom) Guid
  */
  public static generatePseudoRandomGuid(): string {
    const newGuidPlaceholder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const pseudoGuid = newGuidPlaceholder.replace(/[xy]/g, letter => this.generateRandomHexDigit(letter));
    return pseudoGuid;
  }

  private static generateRandomHexDigit(letter: string): string {
    const r = Math.random() * 16 | 0;
    let v: number;
    if (letter === 'x') {
      v = r;
    } else if (letter === 'y') {
      v = r & 0x3 | 0x8;
      /*  r & 0x3 -> Allows either 0x0000, 0x0001, 0x0010 or 0x0011
      * | 0x8    -> 0x1000 = 8
      *             0x1001 = 9
      *             0x1010 = A
      *             0x1011 = B
      * The possible variants of version 4 Guids
      */
    } else {
      throw new Error('Please provide either "x" to indicate a random replacement or "y" to '
        + 'indicate the generation of the variant identifier');
    }
    return v.toString(16);
  }
}
