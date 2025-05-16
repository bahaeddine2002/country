import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';

const DisplayInfo = ({ filtred, tempInfo }) => {
  const country = filtred[0];

  return (
    <Card sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 4, boxShadow: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            {country.name.common}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Capital: {country.capital}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Area: {country.area.toLocaleString()} km²
          </Typography>

          <Typography variant="h5" sx={{ mt: 3 }}>
            Languages
          </Typography>
          <List>
            {Object.keys(country.languages).map((key, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={country.languages[key]} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={country.flags.svg}
            alt={country.flags.alt}
            sx={{ borderRadius: 4, boxShadow: 2 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        Weather in {country.capital}
      </Typography>
      {tempInfo ? (
        <Box>
          <Typography variant="h6">
            Temperature: {tempInfo.main.temp}°C
          </Typography>
          <CardMedia
            component="img"
            image={`https://openweathermap.org/img/wn/${tempInfo.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            sx={{ width: 100, mx: 'auto', my: 2 }}
          />
          <Typography variant="h6">Wind: {tempInfo.wind.speed} m/s</Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Loading weather data...
        </Typography>
      )}
    </Card>
  );
};

const DisplayList = ({ filtred, onView }) => {
  return (
    <Box sx={{ mt: 4 }}>
      {filtred.map((country, i) => (
        <Card key={i} sx={{ mb: 2, p: 2 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">{country.name.common}</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => onView(country)}
            >
              Show
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const Display = ({ filtredCount, onView, tempInfo }) => {
  const nbr = filtredCount.length;

  if (nbr >= 10) {
    return <Typography variant="body1">Too many matches, specify another filter</Typography>;
  } else if (nbr === 1) {
    return <DisplayInfo filtred={filtredCount} tempInfo={tempInfo} />;
  } else {
    return <DisplayList filtred={filtredCount} onView={onView} />;
  }
};

function App() {
  const [input, setInput] = useState('');
  const [countries, setCountries] = useState([]);
  const [filtredCount, setFiltredCount] = useState([]);
  const [tempInfo, setTempInfo] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  const handelChange = (event) => {
    setInput(event.target.value);
    const filtred = countries.filter((country) => {
      const lowerContry = country.name.common.toLowerCase();
      return lowerContry.includes(event.target.value.toLowerCase());
    });
    setFiltredCount(filtred);
  };

  const onView = (country) => {
    setFiltredCount([country]);
  };

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if (filtredCount.length === 1) {
      const country = filtredCount[0];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&units=metric&appid=${api_key}`
        )
        .then((response) => {
          setTempInfo(response.data);
        });
    }
  }, [filtredCount]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Find Countries
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search"
        value={input}
        onChange={handelChange}
        sx={{ mb: 4 }}
      />
      <Display filtredCount={filtredCount} onView={onView} tempInfo={tempInfo} />
    </Box>
  );
}

export default App;
