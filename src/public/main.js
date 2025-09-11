const button = document.querySelector('#btn');
const input = document.querySelector('#input');

const connection = () => {
    console.log('click', input.value)
  const socket = io('http://localhost:3000', {
    auth: {
      token: input.value,
    },
  });

  socket.on('message', (data) => {
    console.log(data);
  });

  socket.on('error', (data) => {
    alert(data);
  });

  socket.on('disconnect', (data) => {
    console.log('disconnect');
  });
};

button.addEventListener('click', connection)
