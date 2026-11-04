const { execSync } = require('node:child_process');

// Grava no build o commit exato do código (tela "Sobre o App"), para conferir a versão
// distribuída contra o repositório. No EAS Build o checkout pode não ter .git; nesse caso
// a variável EAS_BUILD_GIT_COMMIT_HASH (ou COMMIT_HASH, definida manualmente) é usada.
function git(command) {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

const commitHash =
  process.env.EAS_BUILD_GIT_COMMIT_HASH ?? process.env.COMMIT_HASH ?? git('rev-parse HEAD') ?? 'indisponível';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash,
  },
});
