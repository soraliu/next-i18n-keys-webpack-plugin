const Parser = require('i18next-scanner').Parser;
const matchAll = require('string.prototype.matchall');
const { ReplaceSource } = require('webpack-sources');

const extractI18nKeysBySource = (source, options) => {
  const parser = new Parser(options);

  const data = new Set();
  const result = parser.parseFuncFromString(source, options, key => {
    data.add(key);
  });

  return Array.from(data);
}

const getReplacedSource = ({ sourceAsset, matchReg, replacement }) => {
  const replaceSource = new ReplaceSource(sourceAsset);
  const source = sourceAsset.source();

  if (typeof source !== 'string') {
    return sourceAsset;
  }

  [...matchAll(source, matchReg)].forEach((match) => {
    const matchedStr = match[0];
    const start = match.index;
    const end = start + matchedStr.length;

    console.log('replaced', start, end, replacement);
    replaceSource.replace(start, end, replacement);
  });

  return replaceSource;
}

/**
 * replace a str to current page i18n keys
 */
class NextI18nKeysWebpackPlugin {
  constructor({
    matchReg,
    funcList,
  } = {}) {
    this.matchReg = matchReg || /'\^__I18N_KEYS__\$'/;

    const options = {
      func: {
        list: funcList || ['getLabel'],
      },
      keySeparator: false,
      nsSeparator: ':',
      interpolation: {
        prefix: '{{',
        suffix: '}}',
      },
      defaultNs: 'default',
      ns: ['default'],
      lngs: ['en'],
    };
    this.scannerOptions = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('NextI18nKeysWebpackPlugin', compilation => {
      compilation.hooks.chunkAsset.tap('NextI18nKeysWebpackPluginChunkAsset', (chunk, filename) => {
        if (/pages\//.test(filename)) {
          const modules = Array.from(chunk._modules)
            .filter(chunk => chunk.type !== 'javascript/dynamic')
            .filter(({ id }) => !/node_modules\//.test(id))

          const keys = modules.map(({ _source: { _value } }) => extractI18nKeysBySource(_value, this.scannerOptions)).reduce((a, b) => a.concat(b), []);
          const replacement = JSON.stringify(keys);

          const sourceAsset = compilation.assets[filename];
          const matchReg = this.matchReg;
          compilation.assets[filename] = getReplacedSource({ sourceAsset, matchReg, replacement });
        }
      });
    });
  }
}

module.exports = NextI18nKeysWebpackPlugin;
