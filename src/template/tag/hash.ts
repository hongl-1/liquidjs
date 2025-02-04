import { _evalToken } from '../../render/expression'
import { Context } from '../../context/context'
import { Tokenizer } from '../../parser/tokenizer'

export interface HashValue {
  [key: string]: any;
}

/**
 * Key-Value Pairs Representing Tag Arguments
 * Example:
 *    For the markup `, foo:'bar', coo:2 reversed %}`,
 *    hash['foo'] === 'bar'
 *    hash['coo'] === 2
 *    hash['reversed'] === undefined
 */
export class Hash {
  hash: HashValue = {}
  constructor (markup: string, jekyllStyle?: boolean) {
    const tokenizer = new Tokenizer(markup, {})
    for (const hash of tokenizer.readHashes(jekyllStyle)) {
      this.hash[hash.name.content] = hash.value
    }
  }
  * render (ctx: Context): Generator<unknown, HashValue, unknown> {
    const hash = {}
    for (const key of Object.keys(this.hash)) {
      hash[key] = this.hash[key] === undefined ? true : yield _evalToken(this.hash[key], ctx)
    }
    return hash
  }
}
