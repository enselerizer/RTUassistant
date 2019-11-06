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
      // Действие: поиск
      let match = str.match(
        /^((покажи(( [а-яА-Я]+)+)? )?где( находится| расположен| располагается)?) ?/
      );
      if (match != null) {
        res.groups.push({
          type: 'action',
          target: 'where',
          raw: match[1]
        });
        str = str.substr(match[0].length);
      }

      // Модификатор: кабинет
      match = str.match(/^(кабинет|((лекционная )?аудитория)|класс|((лекционный )?зал)|комната) ?/);
      if (match != null) {
        res.groups.push({
          type: 'modifier',
          target: 'cab',
          raw: match[1]
        });
        str = str.substr(match[0].length);
      }

      // Сущность: кабинет
      match = str.match(/^(([абвгд]) ([0-9]{1,3})( ([0-9абвг]))?) ?/);
      if (match != null) {
        res.groups.push({
          type: 'subject',
          target: 'cab',
          raw: match[0],
          fancy: `${match[2].toUpperCase()}-${match[3]}${match[5] != undefined ? '.' + match[5] : ''}`
        });
        str = str.substr(match[0].length);
      }

      // Сущность: филлер
      match = str.match(/^([а-яА-Яa-zA-Z0-9]+) ?/);
      if (match != null) {
        res.groups.push({
          type: 'filler',
          raw: match[0],
          fancy: match[1]
        });
        str = str.substr(match[0].length);
      }
    }
    return res;
  }
}
