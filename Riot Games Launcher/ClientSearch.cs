using Microsoft.WindowsAPICodePack.Dialogs;
using System.Diagnostics;
using System.Windows.Forms;

namespace Riot_Games_Launcher
{
    class ClientSearch
    {


        //Save the absolute path to Riot Games Folder
        private string riot_games_folder = string.Empty;


        //Launch parameter for every game
        private readonly string League_of_legends = "--launch-product=league_of_legends --launch-patchline=live";
        private readonly string bacon = "--launch-product=bacon --launch-patchline=live";
        private readonly string valorant = "--launch-product=valorant --launch-patchline=live";

        private void ShowDIalog()
        {
            MessageBox.Show("Select your Riot Games Folder", "", MessageBoxButtons.OK);
        }
        private void WriteSettings(string riot_games_folder)
        {

            // set the properties value
            if (riot_games_folder != string.Empty)
            {
                Properties.Settings.Default.RiotGames = riot_games_folder;
                // Saves settings in application configuration file
                Properties.Settings.Default.Save();
            }

        }



        public void LoadSettings()
        {
            //Load the configuration file
            riot_games_folder = Properties.Settings.Default.RiotGames;

        }

        //Game start method
        public void StartLeagueOfLegends()
        {
            Process.Start(riot_games_folder, League_of_legends);
        }

        public void StartBacon()
        {
            Process.Start(riot_games_folder, bacon);
        }

        public void StartValorant()
        {
            Process.Start(riot_games_folder, valorant);
        }


        public void SearchDirectory()
        {
            if (riot_games_folder == string.Empty)
            {
                ShowDIalog();

                CommonOpenFileDialog dialog = new CommonOpenFileDialog
                {
                    InitialDirectory = "C:\\",
                    IsFolderPicker = true
                };
                if (dialog.ShowDialog() == CommonFileDialogResult.Ok)
                {
                    riot_games_folder = (dialog.FileName) + "\\Riot Client\\RiotClientServices.exe";
                    WriteSettings(riot_games_folder);
                }

            }

        }


    }

}
