export function AideContent() {
  return (
    <article className="mt-8 max-w-3xl space-y-10 text-nuit/85">
      <Section
        kicker="01"
        title="À quoi sert ce test"
      >
        <p>
          Le test sert à orienter un élève qui sait déjà <strong>lire l&apos;arabe</strong>{" "}
          vers l&apos;un des trois premiers niveaux du programme Al-Furqan :{" "}
          <strong>MUQADIMA ALIF</strong> (niveau 1),{" "}
          <strong>TA3BIR</strong> (niveau 2) ou{" "}
          <strong>MUQADIMA BA</strong> (niveau 3). Au-delà, c&apos;est un
          échange direct avec l&apos;élève qui détermine le niveau d&apos;entrée.
        </p>
        <p className="mt-3">
          Les non-lecteurs ne passent pas le test : ils s&apos;inscrivent
          directement en MUQADIMA ALIF.
        </p>
      </Section>

      <Section
        kicker="02"
        title="Comment se passe un test, du côté de l'élève"
      >
        <ul className="space-y-2.5">
          <Bullet>
            Le test fait <strong>5 questions fixes</strong>, à difficulté
            croissante, sur les trois premiers niveaux. Tous les élèves voient
            le même schéma de difficulté.
          </Bullet>
          <Bullet>
            Le plan : 2 questions niveau 1 (lecture, vocabulaire), 1 question
            niveau 2 (vocabulaire), 2 questions niveau 3 (grammaire,
            compréhension).
          </Bullet>
          <Bullet>
            Le test n&apos;est <strong>pas adaptatif</strong> : la difficulté
            ne s&apos;ajuste pas en fonction des réponses, ce qui rend le score
            plus lisible et reproductible.
          </Bullet>
          <Bullet>
            Une question par écran, pas de retour en arrière. Durée estimée :
            2 à 4 minutes.
          </Bullet>
          <Bullet>
            À la fin, l&apos;élève voit son niveau préconisé. On lui propose
            ensuite de laisser ses coordonnées pour être recontacté.
          </Bullet>
        </ul>
      </Section>

      <Section
        kicker="03"
        title="Comment le niveau final est calculé"
      >
        <p>
          Le niveau préconisé dépend uniquement du nombre de bonnes réponses
          sur les 5 questions :
        </p>
        <ul className="mt-3 space-y-2">
          <Bullet>
            <strong>0 ou 1 bonne réponse</strong> → MUQADIMA ALIF (niveau 1) :
            les bases ne sont pas solides.
          </Bullet>
          <Bullet>
            <strong>2 ou 3 bonnes réponses</strong> → TA3BIR (niveau 2).
          </Bullet>
          <Bullet>
            <strong>4 ou 5 bonnes réponses</strong> → MUQADIMA BA (niveau 3).
          </Bullet>
        </ul>
        <p className="mt-3">
          En plus du niveau préconisé, le système calcule un pourcentage de
          réussite par catégorie (lecture, vocabulaire, grammaire,
          compréhension) pour identifier rapidement les points forts et
          faibles.
        </p>
      </Section>

      <Section
        kicker="04"
        title="Le pool de questions (le plus important à comprendre)"
      >
        <p>
          Le test a besoin d&apos;une question pour chacune des 5 cases du
          plan : (niveau 1 · lecture), (niveau 1 · vocabulaire), (niveau 2 ·
          vocabulaire), (niveau 3 · grammaire), (niveau 3 · compréhension).
          Pour chaque case, il en pioche une au hasard parmi les questions{" "}
          <strong>publiées</strong> qui correspondent.
        </p>
        <div className="mt-4 rounded-xl bg-creme/60 p-5 text-sm">
          <p className="font-display text-nuit">
            👉 Plus tu as de questions par case, plus le test est varié entre
            deux élèves.
          </p>
          <p className="mt-2 text-nuit/70">
            Si tu n&apos;as que 3 questions sur la case (niveau 1 · lecture),
            deux élèves qui démarrent ont 1 chance sur 3 de tomber sur la même
            première question. Avec 8 ou 10 questions, c&apos;est beaucoup
            plus rare.
          </p>
        </div>
        <p className="mt-4">
          <strong>Recommandation :</strong> vise au moins 6 questions par
          case, soit 30 questions publiées au total. Si une case est vide, le
          test bascule automatiquement sur une catégorie voisine au même
          niveau, puis sur un niveau adjacent en dernier recours.
        </p>
      </Section>

      <Section
        kicker="05"
        title="Les 3 statuts d'une question"
      >
        <ul className="space-y-3">
          <Statut
            color="bg-amber-100 text-amber-800 ring-amber-300/50"
            label="Brouillon"
          >
            La question est dans la base mais n&apos;est jamais montrée au
            public. À toi de la valider, la corriger ou la supprimer.
          </Statut>
          <Statut
            color="bg-emerald-100 text-emerald-800 ring-emerald-300/50"
            label="Publiée"
          >
            La question peut être tirée par le test. Elle apparaît aux élèves.
          </Statut>
          <Statut
            color="bg-nuit/10 text-nuit/65 ring-nuit/20"
            label="Archivée"
          >
            La question est retirée du test, mais conservée. Pratique si tu
            veux la remettre plus tard sans la retaper.
          </Statut>
        </ul>
      </Section>

      <Section
        kicker="06"
        title="D'où viennent les questions"
      >
        <p>
          Chaque question a une étiquette qui indique son origine :
        </p>
        <ul className="mt-3 space-y-2">
          <Bullet>
            <strong>Manuel</strong> — tu l&apos;as créée toi-même via le
            bouton « Nouvelle question ».
          </Bullet>
          <Bullet>
            <strong>IA · seed</strong> — générée par l&apos;intelligence
            artificielle lors du remplissage initial.
          </Bullet>
          <Bullet>
            <strong>IA · admin</strong> — générée à la chaud via le bouton
            ✨ Générer dans cette page.
          </Bullet>
        </ul>
      </Section>

      <Section
        kicker="07"
        title="Voir les résultats des tests passés"
      >
        <p>
          Dans la sidebar, l&apos;onglet{" "}
          <strong>Résultats des tests</strong> liste tous les élèves qui ont
          passé le test. Tu peux ouvrir chaque tentative pour voir :
        </p>
        <ul className="mt-3 space-y-2">
          <Bullet>Le niveau préconisé par le système.</Bullet>
          <Bullet>
            Toutes les questions vues par l&apos;élève, dans l&apos;ordre,
            avec sa réponse et la bonne réponse.
          </Bullet>
          <Bullet>Le détail des points forts et faibles par catégorie.</Bullet>
        </ul>
        <p className="mt-3">
          C&apos;est ici que tu peux <strong>juger toi-même</strong> si le
          niveau préconisé est cohérent avec les réponses données. Si tu
          trouves le résultat trop sévère ou trop indulgent, c&apos;est le
          signe qu&apos;il faut revoir certaines questions du pool (les
          modifier ou en ajouter au bon niveau).
        </p>
      </Section>

      <Section
        kicker="08"
        title="Ce qu'on te recommande de faire en pratique"
      >
        <ol className="space-y-3">
          <Step n={1}>
            Filtre par <strong>« Brouillons »</strong> et valide les questions
            une par une. Si tu fais confiance à l&apos;IA, utilise le bouton
            <strong> ✓ Tout publier</strong> qui apparaît en haut.
          </Step>
          <Step n={2}>
            Concentre-toi sur les 5 cases servies par le test : (N1 · lecture),
            (N1 · vocabulaire), (N2 · vocabulaire), (N3 · grammaire), (N3 ·
            compréhension). Ce sont les seules vues par les élèves.
          </Step>
          <Step n={3}>
            Quand une case te semble pauvre en variété, clique{" "}
            <strong>✨ Générer</strong> et demande quelques questions
            supplémentaires (coût : quelques centimes par lot).
          </Step>
          <Step n={4}>
            De temps en temps, va voir l&apos;onglet <strong>Résultats des tests</strong>{" "}
            pour vérifier que les niveaux préconisés sont cohérents avec les
            réponses des élèves.
          </Step>
        </ol>
      </Section>
    </article>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-display text-[11px] uppercase tracking-[0.3em] text-dore-700">
        {kicker}
      </p>
      <h2 className="mt-1.5 font-display text-2xl text-nuit">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-dore" />
      <span>{children}</span>
    </li>
  );
}

function Statut({
  color,
  label,
  children,
}: {
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-wrap items-baseline gap-3">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${color}`}
      >
        {label}
      </span>
      <span className="flex-1 min-w-[200px]">{children}</span>
    </li>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-nuit text-[11px] font-bold text-creme">
        {n}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}
