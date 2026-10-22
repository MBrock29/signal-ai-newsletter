export const newsletterSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['editionTitle', 'items'],
  properties: {
    editionTitle: { type: 'string' },
    items: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'title',
          'publisher',
          'url',
          'publishedAt',
          'category',
          'summary',
          'teachingMoment',
          'caveat',
          'score',
        ],
        properties: {
          title: { type: 'string' },
          publisher: { type: 'string' },
          url: { type: 'string' },
          publishedAt: { type: 'string' },
          category: { type: 'string' },
          summary: { type: 'string' },
          teachingMoment: { type: 'string' },
          caveat: {
            type: 'string',
            description:
              'A concise 1-2 sentence reader-facing limitation or uncertainty about the story itself. Never include editorial scores, candidate numbers, ranking notes, penalties, or selection rationale.',
          },
          score: { type: 'number' },
        },
      },
    },
  },
} as const;
