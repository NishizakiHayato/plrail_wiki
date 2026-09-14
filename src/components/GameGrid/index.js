import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {games} from '@site/src/games';
import styles from './styles.module.css';

export default function GameGrid() {
  return (
    <section className={styles.grid}>
      <div className="container">
        <div className="row">
          {games.map((game) => (
            <div key={game.id} className={clsx('col col--4', styles.col)}>
              <Link className={styles.card} to={`/${game.id}/`}>
                <Heading as="h3" className={styles.cardTitle}>
                  {game.label}
                </Heading>
                <span className={styles.cardLink}>进入 →</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
