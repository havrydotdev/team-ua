import { SetMetadata } from '@nestjs/common';

import { REGISTERED_METADATA_KEY } from '../constants';

export const Registered = () => SetMetadata(REGISTERED_METADATA_KEY, true);
