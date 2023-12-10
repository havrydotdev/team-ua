import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export const InjectCache = () => Inject(CACHE_MANAGER);
