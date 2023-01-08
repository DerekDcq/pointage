import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './images/essailogo1.png';
import fr from "date-fns/locale/fr";
import { useAuth0 } from "@auth0/auth0-react";



const getDays = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return [];
  }

  const days = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = new Date(currentDate.getTime() + 86400000); // 86400000ms = 1 jour
  }
  return days;
}

const App = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleChange = (update) => {
    setDateRange(update);
  }

  const handleChangeRaw = (update) => {
    setDateRange([update.startDate, update.endDate]);
  }

  const days = getDays(startDate, endDate);



  const [currentTime, setCurrentTime] = useState('');
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const time = currentDate.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' });
      setCurrentTime(time);
      const date = currentDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setCurrentDateString(date);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Define the totalHours variable
  let totalHours = 0;

  // Calculez le nombre total d'heures entrées par l'utilisateur
  totalHours = days.reduce((acc, day) => {
    const formattedDate = day.toISOString().replace(/[:.]/g, '_');
    const hoursInput = document.querySelector(`#hours-${formattedDate}`);
    if (hoursInput) {
      return acc + parseInt(hoursInput.value, 10);
    }
    return acc;
  }, 0);
  const handleSubmit = (event) => {
    event.preventDefault();



    // Récupérez les commentaires de chaque jour
    const comments = days.map((day) => {
      const formattedDate = day.toISOString().replace(/[:.]/g, '_');
      const commentInput = document.querySelector(`#comment-${formattedDate}`);
      if (commentInput) {
        return commentInput.value;
      }
      return '';
    });

    // Créez un objet contenant les données à envoyer à votre API
    const data = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalHours,
      comments,
    };

    // Envoyez les données à votre API
    fetch('/api/timesheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }




  // Call the useAuth0 hook
  const { isAuthenticated} = useAuth0();

  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      {/* Show the login button if the user is not authenticated */}
      {!isAuthenticated && (
        <div className=' flex justify-center h-100vh flex-col items-center'>
          <img src={logo} alt='logo' className='w-60 mt-4'></img>
          <p className='text-gray-800 font-extrabold text-2xl mt-10'>Application de pointage hebdomadaire</p>
          <button className='w-40 bg-blue-800 rounded-md shadow-md text-white font-bold h-10 mt-60' onClick={() => loginWithRedirect()}>Connexion</button>
        </div>
      )}

      {/* Show the user's profile information if they are authenticated */}
      {isAuthenticated && (
        
          <div className='p-4 bg-gray-50'>
            <div className="text-center flex justify-center flex-col items-center">
              <img src={logo} alt='logo' className='w-60'></img>
              <p className='font-bold'>{currentTime}</p>
              <p className='pb-4 font-bold'>{currentDateString}</p>
            </div>
            <div className='flex justify-center'>
              <DatePicker
                placeholderText='Cliquez ici'
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                onChangeRaw={handleChangeRaw}
                withPortal
                locale={fr}
                onFocus={(e) => e.target.readOnly = true}
                className='mb-4 font-bold text-center'
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {days.map((day, index) => (
                <div key={index} className="col-span-1 flex flex-col items-center p-4 rounded-md shadow-md bg-white">
                  <p className="text-gray-600 text-sm font-bold">{day.getDate()}</p>
                  <p>{day.toLocaleString('default', { weekday: 'long' })}</p>
                  <input
                    type="text"
                    className="bg-gray-200 rounded-md px-2 py-1 my-4 w-20 lg:w-40"

                  />
                  <input type="time" step='1800' className="bg-gray-200 rounded-md px-2 py-1" />
                </div>
              ))}
            </div>
            <p className="text-center mt-4 font-bold">Total: {totalHours} heures</p>
            <div className='text-center flex justify-center flex-col items-center'>
              <button onSubmit={handleSubmit} className='py-1 px-2 bg-blue-800 text-white font-bold rounded-md shadow-md my-6'>ENREGISTRER</button>
            </div>
          </div>
      )}
    </div>
  );
}

export default App