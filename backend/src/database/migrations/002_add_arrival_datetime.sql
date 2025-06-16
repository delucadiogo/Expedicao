-- Adiciona o campo de data e hora de chegada do caminhão
ALTER TABLE expeditions
ADD COLUMN arrival_datetime TIMESTAMP;

-- Comentário explicativo
COMMENT ON COLUMN expeditions.arrival_datetime IS 'Data e hora em que o caminhão chegou para a expedição'; 