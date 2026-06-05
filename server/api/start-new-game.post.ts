import { getPanoramaxPictureIDs } from '~/utils/panoramax';

type NewGameResponse = {
  locationIds: string[];
}

export default defineEventHandler(async (): Promise<NewGameResponse> => {
  const pictures = await getPanoramaxPictureIDs(5);
  return { locationIds: pictures.map(p => p.id) };
});
