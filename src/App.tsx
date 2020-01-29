import React, { useState } from "react";
import { Imatch } from "./Shared/match.interface";
import { Randomize } from "./Shared/random";
import "./App.css";
import { GameMode } from "./Shared/GameMode.enum";
import ChipInput from "material-ui-chip-input";
import Result from "./Shared/Components/Result";
import { IResult } from "./Shared/result.interface";

function App() {
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [result, setResult] = useState<IResult>({matches: [], mode: GameMode.TeamPickerUnique});
  const [errorMessage, setErrorMessage] = useState<string>();

  const handlePlayerDelete = (chipToDelete: string) => {
    setPlayers(players.filter(player => player !== chipToDelete));
  };

  const handleTeamDelete = (chipToDelete: string) => {
    setTeams(teams.filter(player => player !== chipToDelete));
  };

  const handleTeamsChange = (team: string[]) => {
    setTeams([...teams, ...team]);
  };

  const handlePlayersChange = (player: string[]) => {
    setPlayers([...players, ...player]);
  };

  const printResults = (list: Imatch[]): string => {
    const matches: string[] = list.map(item => item.player + " - " + item.team);

    return list.length
      ? matches.reduce((result, match) => `${result}\n ${match}`)
      : "";
  };

  const runRandomize = (mode: GameMode) => {
    try {
      const result = Randomize([...players], [...teams], mode);
      setResult({ matches: result, mode });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Team Randomizer</h1>
      </header>
      <div>
        <div className="errorMessage">
          {errorMessage && <h3>{errorMessage}</h3>}
        </div>
        <div className="container">
          <div className="cell">
            <h4>Players</h4>
            <ChipInput
              value={players}
              onAdd={(chip: string) => handlePlayersChange([chip])}
              onDelete={(deletedChip: string) =>
                handlePlayerDelete(deletedChip)
              }
              onPaste={event => {
                const clipboardText: string = event.clipboardData.getData(
                  "Text"
                );

                event.preventDefault();

                handlePlayersChange(
                  clipboardText.split("\n").filter(t => t.length > 0)
                );
              }}
            />
          </div>
          <div className="cell">
            <h4>Teams</h4>
            <ChipInput
              value={teams}
              onAdd={(chip: string) => handleTeamsChange([chip])}
              onDelete={deletedChip => handleTeamDelete(deletedChip)}
              onPaste={event => {
                const clipboardText: string = event.clipboardData.getData(
                  "Text"
                );

                event.preventDefault();

                handleTeamsChange(
                  clipboardText.split("\n").filter(t => t.length > 0)
                );
              }}
            />
          </div>
        </div>
        <button
          id="randomizeBtn"
          className="btn"
          onClick={() => runRandomize(GameMode.TeamPickerUnique)}
        >
          <h2>Pick a team</h2>
        </button>
        <button
          id="randomizeBtn"
          className="btn"
          onClick={() => runRandomize(GameMode.TeamPickerShared)}
        >
          <h2>Distribute by teams</h2>
        </button>
        {result.matches.length > 0 && (
          <div>
            <h3>Result</h3>
            <Result  matches= {result.matches!} mode={result.mode}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
