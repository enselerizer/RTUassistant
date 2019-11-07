import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SemanticAnalyserService {
  improveString(str: string) {
    let res = str;

    // Форматирование названий аудиторий
    res = res.replace(
      /([абвгд]) ([0-9]{1,3})( ([0-9абвг]))?/,
      (match, ...g: string[]) =>
        `${g[0].toUpperCase()}-${g[1]}${g[3] != undefined ? '.' + g[3] : ''}`
    );

    return res;
  }

  analyseString(str: string) {
    let res = {
      groups: []
    };

    while (str.length > 0) {

      // Действие: общее
      let match = str.match(
        /^(скажи|расскажи|покажи|найди) ?/
      );
      if (match != null) {
        res.groups.push({
          type: 'action',
          target: 'general',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-action',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Действие: где
      match = str.match(
        /^((где)( находится| расположен| располагается)?) ?/
      );
      if (match != null) {
        res.groups.push({
          type: 'action',
          target: 'where',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-action',
              val: match[2]
            },
            {
              class: '',
              val: match[3] == undefined ? ' ' :  match[3] + ' '
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Действие: когда
      match = str.match(
        /^(когда|как скоро|через сколько) ?/
      );
      if (match != null) {
        res.groups.push({
          type: 'action',
          target: 'when',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-action',
              val: match[1] + ' '
            },
          ]
        });
        str = str.substr(match[0].length);
      }

      // Модификатор: ближайший
      match = str.match(/^(следующ(ий|ая|ие|их)|ближайш(ий|ая|ие|их)|последн(ий|яя|ие|их)|сейчас) ?/);
      if (match != null) {
        res.groups.push({
          type: 'modifier',
          target: 'nearest',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-modifier',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Модификатор: сегодня
      match = str.match(/^((на |для )?(сегодняшн(ий|его) д(ень|ня)|сегодня)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'modifier',
          target: 'today',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-modifier',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Модификатор: завтра
      match = str.match(/^((на |для )?(завтрашн(ий|его) д(ень|ня)|завтра)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'modifier',
          target: 'tomorrow',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-modifier',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Модификатор: вчера
      match = str.match(/^((на |для )?(вчерашн(ий|его) д(ень|ня)|вчера)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'modifier',
          target: 'yesterday',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-modifier',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }



      // Сущность: кабинет
      match = str.match(/^(кабинет(ы|a)?|((лекционн(ая|ые|ой) )?аудитори(я|и))|класс(ы|а)?|((лекционн(ый|ые|ого) )?зал(ы|а)?)|комнат(а|ы)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'cab',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: туалет
      match = str.match(/^(туалет(ы)?|сануз(ел|лы)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'cab',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: вход
      match = str.match(/^(вход(ы)?) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'enter',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: выход
      match = str.match(/^(выход(ы)?) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'exit',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: занятие
      match = str.match(/^(пара|занятие|урок) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'lesson',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[1] + ' '
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: расписание
      match = str.match(/^(пар(ы|ах)|спис(ок|ке) пар|занятия(х)?|уро(ки|ах)|расписани(е|и)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'schedule',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[1] + ' '
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: новости
      match = str.match(/^(события(х)?|новост(и|ях)) ?/);
      if (match != null) {
        res.groups.push({
          type: 'entity',
          target: 'news',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-entity',
              val: match[1] + ' '
            }
          ]
        });
        str = str.substr(match[0].length);
      }

      // Значение: кабинет
      match = str.match(/^(([абвгд]) ([0-9]{1,3})( ([0-9абвг]))?) ?/);
      if (match != null) {
        res.groups.push({
          type: 'value',
          target: 'cab',
          raw: match[0],
          improved: `${match[2].toUpperCase()}-${match[3]}${match[5] != undefined ? '.' + match[5] : ''}`,
          fancy: [
            {
              class: 'stt-value',
              val: `${match[2].toUpperCase()}-${match[3]}${match[5] != undefined ? '.' + match[5] : ''} `
            }
          ]
        });
        str = str.substr(match[0].length);
      }







      // Сущность: филлер
      match = str.match(/^([а-яА-Яa-zA-Z0-9]+) ?/);
      if (match != null) {
        res.groups.push({
          type: 'filler',
          raw: match[0],
          improved: match[1],
          fancy: [
            {
              class: 'stt-filler',
              val: match[0]
            }
          ]
        });
        str = str.substr(match[0].length);
      }
    }
    return res;
  }
}
