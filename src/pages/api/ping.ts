import createApiHandler from '../../lib/api/create-api-handler';

const PingHandler = createApiHandler().get((_req, res) => {
  res.json({
    pong: true,
  });
});

export default PingHandler;
