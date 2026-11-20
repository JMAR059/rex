import { useState } from 'react';

const operations = [
  { name: 'Project', syntax: 'project_ {attrs} Relation' },
  { name: 'Natural Join', syntax: 'Relation1 * Relation2' },
  { name: 'Intersect', syntax: 'Relation1 ^ Relation2' },
  { name: 'Set subtraction', syntax: 'Relation1 - Relation2' },
  { name: 'Select', syntax: 'select_ {attrs} Relation' },
  { name: 'Cartesian Product', syntax: 'Relation1 X Relation2' },
  { name: 'Project All Attrs', syntax: 'Relation' },
];

const pages = [
  { id: 'operations', label: 'Supported Operations' },
  { id: 'examples', label: 'Sample Queries' },
] as const;

const Wiki: React.FC = () => {
  const [page, setPage] = useState<(typeof pages)[number]['id']>('operations');

  return (
    <aside id="guide-panel" aria-label="Guide" className="flex h-full min-h-0 min-w-0 flex-col">
      <div className="self-start bg-header text-header-fg border-[length:var(--border-w)] border-b-0 border-ink px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wider">
        Guide:
      </div>
      <div className="flex flex-1 min-h-0 min-w-0 flex-col border-[length:var(--border-w)] border-ink bg-surface shadow-[calc(var(--shadow-offset)*1.5)_calc(var(--shadow-offset)*1.5)_0_var(--color-header)]">
        <nav aria-label="Guide pages" className="flex min-w-0 gap-2 overflow-x-auto border-b-[length:var(--border-w)] border-ink bg-panel-alt p-3 [&>button]:shrink-0 [&>button]:whitespace-nowrap">
          {pages.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPage(id)}
              aria-current={page === id ? 'page' : undefined}
              className={`border-[length:var(--border-thin)] border-ink px-2 py-1 text-xs font-bold uppercase shadow-[calc(var(--shadow-offset)*0.5)_calc(var(--shadow-offset)*0.5)_0_var(--color-ink)] transition-[transform,box-shadow] duration-75 hover:bg-button-accent hover:text-accent-fg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${page === id ? 'bg-paper' : 'bg-bg'}`}
            >
              {label}
            </button>
          ))}

        </nav>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {page === 'operations' ? (
            <section aria-labelledby="guide-operations">
              <h2 id="guide-operations" className="mb-4 text-2xl font-bold uppercase">Supported Operations</h2>
              <hr className="mb-4 w-full border-0 border-t-[length:var(--border-thin)] border-dashed border-ink" />
              <dl className="space-y-4 text-sm">
                {operations.map(({ name, syntax }) => (
                  <div key={name} className="flex items-baseline gap-2 whitespace-nowrap">
                    <dt className="font-extrabold text-xl">{name}:</dt>
                    <dd><code>{syntax}</code></dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : (
            <section aria-labelledby="guide-examples">
              <h2 id="guide-examples" className="mb-4 text-2xl font-bold uppercase">Sample Queries</h2>
              <hr className="mb-4 w-full border-0 border-t-[length:var(--border-thin)] border-dashed border-ink" />
              <h3 className="mb-2 font-bold">Query: Courses</h3>
              <pre className="mb-5 overflow-x-auto border-[length:var(--border-thin)] border-ink bg-bg p-3 font-mono text-sm">
{`CourseID  Name             Credits
CS1100    CS1              4
MATH1100  CALC 1           4
CS1200    DATA STRUCTURES  4`}
              </pre>
              <h3 className="mb-2 font-bold">Query: Courses X CS_Students</h3>
              <pre className="overflow-x-auto border-[length:var(--border-thin)] border-ink bg-bg p-3 font-mono text-sm">
{`CourseID  Courses.Name     Credits  StudentID  CS_Students.Name  Age  Enrolled
CS1100    CS1              4        CS001      Alice             20   CS1, DS
CS1100    CS1              4        CS002      Charlie           19   CS1, Calc, DS
CS1100    CS1              4        CS003      Eve               21   DS
MATH1100  CALC 1           4        CS001      Alice             20   CS1, DS
MATH1100  CALC 1           4        CS002      Charlie           19   CS1, Calc, DS
MATH1100  CALC 1           4        CS003      Eve               21   DS
CS1200    DATA STRUCTURES  4        CS001      Alice             20   CS1, DS
CS1200    DATA STRUCTURES  4        CS002      Charlie           19   CS1, Calc, DS
CS1200    DATA STRUCTURES  4        CS003      Eve               21   DS`}
              </pre>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Wiki;
