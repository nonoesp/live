import { NextApiRequest, NextApiResponse } from 'next'

export default (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ text: 'Hello', names: ['Peter', 'Nono', 'Maria', 'Bea', 'Lourdes', 'Poorna', 'Sujay', 'Gnoddab'] })
}
