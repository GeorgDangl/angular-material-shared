import { GuidGenerator } from './guid-generator';

describe('GuidGenerator', () => {

  it('generates a GUID in the correct format', () => {
    const generated = GuidGenerator.generatePseudoRandomGuid();
    const guidRegex = /^[{(]?[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}[)}]?$/;
    const isGuidFormat = guidRegex.test(generated);
    expect(isGuidFormat).toBeTruthy();
  });

  it('does generate different GUIDs', () => {
    const firstGuid = GuidGenerator.generatePseudoRandomGuid();
    const secondGuid = GuidGenerator.generatePseudoRandomGuid();
    expect(firstGuid).not.toEqual(secondGuid);
  });

});
