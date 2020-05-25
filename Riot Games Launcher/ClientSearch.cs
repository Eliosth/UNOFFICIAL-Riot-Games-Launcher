using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.WindowsAPICodePack.Dialogs;

namespace Riot_Games_Launcher
{
    class ClientSearch 
    {
   

        //Save the absolute path to Riot Games Folder
        private String riot_games_folder = string.Empty;


        //Launch parameter for every game
        private String League_of_legends = "--launch-product=league_of_legends --launch-patchline=live"
            , bacon = "--launch-product=bacon --launch-patchline=live", valorant = "--launch-product=valorant --launch-patchline=live";

        private void ShowDIalog()
        {
            MessageBox.Show("Select your Riot Games Folder", "", MessageBoxButtons.OK);
        }
        private void WriteSettings(string riot_games_folder)
        {

            // set the properties value
            if (riot_games_folder != string.Empty)
           {
                Properties.Settings.Default.RiotGames = riot_games_folder ;
                // Saves settings in application configuration file
               Properties.Settings.Default.Save();
            }

          
            }

        public void LoadSettings()
        {
            riot_games_folder = Properties.Settings.Default.RiotGames;
        }

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
            if(riot_games_folder == string.Empty)
            {
                ShowDIalog();

                CommonOpenFileDialog dialog = new CommonOpenFileDialog();
                dialog.InitialDirectory = "C:\\";
                dialog.IsFolderPicker = true;
                if (dialog.ShowDialog() == CommonFileDialogResult.Ok)
                {
                    riot_games_folder = (dialog.FileName) + "\\Riot Client\\RiotClientServices.exe";
                    WriteSettings(riot_games_folder);
                }
            }
                      
        }


        public void SearchSettings()
        {
            
                ShowDIalog();

                CommonOpenFileDialog dialog = new CommonOpenFileDialog();
                dialog.InitialDirectory = "C:\\";
                dialog.IsFolderPicker = true;
                if (dialog.ShowDialog() == CommonFileDialogResult.Ok)
                {
                    riot_games_folder = (dialog.FileName) + "\\Riot Client\\RiotClientServices.exe";
                    WriteSettings(riot_games_folder);
                }
            

        }

    }

}
