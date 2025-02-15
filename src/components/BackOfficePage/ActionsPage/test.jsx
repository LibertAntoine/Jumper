
return (
    <div>
      <h1>Dog Center</h1>
      <NewsSlider />
      <div id="gallery-options">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dog"
        />
        <label htmlFor="dog-sort">Sort by : </label>
        <select
          id="dog-sort"
          value={dogsSortBy}
          onChange={(e) => setDogsSortBy(e.target.value)}
        >
          <option value="age">Age</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div id="dog-gallery">
        {filteredDogsData.map((dog) => (
          <DogCard
            key={dog.id}
            name={dog.name}
            age={dog.age}
            breed={dog.breed}
            pictureUrl={dog.pictureUrl}
            soundUrl={dog.soundUrl}
          />
        ))}
      </div>
    </div>
  );
}