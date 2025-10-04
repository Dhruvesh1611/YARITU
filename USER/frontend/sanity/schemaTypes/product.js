// sanity/schemaTypes/product.js

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Men', value: 'MEN'},
          {title: 'Women', value: 'WOMEN'},
          {title: 'Children', value: 'CHILDREN'},
        ],
      },
    },
    {
      name: 'type',
      title: 'Type',
      description: 'Jaise: Sherwani, Lehenga, Suit, etc.',
      type: 'string',
    },
    {
      name: 'occasion',
      title: 'Occasion',
      description: 'Jaise: Wedding, Sangeet, etc.',
      type: 'string',
    },
  ],
}