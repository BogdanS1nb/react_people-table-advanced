import { useEffect, useState } from 'react';
import { getPeople } from '../api';
import { Person } from '../types/Person';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable';
import { useParams, useSearchParams } from 'react-router-dom';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();

  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(false);

    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const query = (searchParams.get('query') || '').toLowerCase();
  const sex = searchParams.get('sex'); // 'm' | 'f' | null
  const centuries = searchParams.getAll('centuries');

  const visiblePeople = people.filter(p => {
    // name filter
    const matchesQuery = !query || p.name.toLowerCase().includes(query);

    // sex filter
    const matchesSex = !sex || p.sex === sex;

    // century filter (народжений у цьому столітті)
    const matchesCentury =
      centuries.length === 0 ||
      centuries.includes(String(Math.ceil(p.born / 100)));

    return matchesQuery && matchesSex && matchesCentury;
  });

  return (
    <div className="container">
      <h1 className="title">People Page</h1>

      {loading && <Loader />}
      {error && (
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      )}
      {!loading && !error && people.length === 0 && (
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      )}
      {!loading && !error && people.length > 0 && (
        <PeopleTable people={visiblePeople} selectedSlug={slug} />
      )}
    </div>
  );
};
